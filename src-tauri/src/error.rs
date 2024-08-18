use anyhow::Error as AnyhowError;
use arboard::Error as ArboardError;

#[derive(Debug, thiserror::Error)]
pub enum SerializedError {
    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    Anyhow(#[from] AnyhowError),

    #[error(transparent)]
    ArboardError(#[from] ArboardError),
}

// we must manually implement serde::Serialize
impl serde::Serialize for SerializedError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
