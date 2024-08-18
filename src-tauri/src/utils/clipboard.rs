use crate::error::SerializedError;
use anyhow::Result;
use arboard::{Clipboard, ImageData};
use clipboard_files;
use image::{DynamicImage, ImageBuffer, RgbaImage};
use std::io::Write;
use std::{fs::File, path::PathBuf};

#[tauri::command]
pub fn copy_image(path: String) -> Result<(), SerializedError> {
    let image = ImageData::from_png(&PathBuf::from(path))?;
    let mut clipboard = Clipboard::new()?;
    clipboard.set_image(image)?;
    Ok(())
}

pub fn get_clipboard_files() -> Result<Vec<PathBuf>> {
    let files = clipboard_files::read().map_err(|e| anyhow::anyhow!("{:?}", e))?;
    let filtered_files: Vec<PathBuf> = files.into_iter().filter(|path| path.is_file()).collect();
    Ok(filtered_files)
}

pub fn get_clipboard_image() -> Result<ImageData<'static>> {
    let mut clipboard = Clipboard::new()?;
    let image = clipboard.get_image()?;
    Ok(image)
}
pub trait ImageDataExt {
    fn save_as_png(&self, path: &PathBuf) -> Result<()>;
    fn from_png(path: &PathBuf) -> Result<ImageData<'static>>;
    fn serialize_to_file(&self, path: &PathBuf) -> Result<()>;
    fn deserialize_from_file(path: &PathBuf) -> Result<ImageData<'static>>;
}

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct SerializableImageData {
    width: u32,
    height: u32,
    bytes: Vec<u8>,
}

impl From<&ImageData<'static>> for SerializableImageData {
    fn from(image_data: &ImageData<'static>) -> Self {
        SerializableImageData {
            width: image_data.width as u32,
            height: image_data.height as u32,
            bytes: image_data.bytes.to_vec(),
        }
    }
}

impl ImageDataExt for ImageData<'static> {
    fn save_as_png(&self, path: &PathBuf) -> Result<()> {
        let image: RgbaImage = ImageBuffer::from_raw(
            self.width.try_into()?,
            self.height.try_into()?,
            self.bytes.clone().into_owned(),
        )
        .ok_or_else(|| anyhow::anyhow!("Failed to create image buffer from clipboard data"))?;

        let image = DynamicImage::ImageRgba8(image);
        image.save(path)?;

        Ok(())
    }

    fn from_png(path: &PathBuf) -> Result<ImageData<'static>> {
        let buffer = image::open(path).map_err(|_| anyhow::anyhow!("无法确定图像格式"))?;
        let image = buffer.to_rgba8();
        let (width, height) = image.dimensions();
        let bytes = image.into_raw();

        Ok(ImageData {
            width: width.try_into()?,
            height: height.try_into()?,
            bytes: std::borrow::Cow::Owned(bytes),
        })
    }

    fn serialize_to_file(&self, path: &PathBuf) -> Result<()> {
        let serializable_data: SerializableImageData = self.into();
        let serialized_data = bincode::serialize(&serializable_data)?;
        let mut file = File::create(path)?;
        file.write_all(&serialized_data)?;
        Ok(())
    }

    fn deserialize_from_file(path: &PathBuf) -> Result<ImageData<'static>> {
        let serialized_data = std::fs::read(path)?;
        let deserialized_data: SerializableImageData = bincode::deserialize(&serialized_data)?;
        Ok(ImageData {
            width: deserialized_data.width as usize,
            height: deserialized_data.height as usize,
            bytes: std::borrow::Cow::Owned(deserialized_data.bytes),
        })
    }
}

pub fn get_clipboard_text() -> Result<String> {
    let mut clipboard = Clipboard::new()?;
    let text = clipboard.get_text()?;
    Ok(text)
}
