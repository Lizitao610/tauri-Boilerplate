import { CategoryType } from "@/tauri-commands";
import { Image, Link2, Paperclip, Text } from "lucide-react";

export const CategoriesDisplayInfo = {
  [CategoryType.text]: {
    name: "文字",
    icon: ({ className }: { className?: string }) => {
      return <Text className={className} />;
    },
  },
  [CategoryType.link]: {
    name: "链接",
    icon: ({ className }: { className?: string }) => {
      return <Link2 className={className} />;
    },
  },
  [CategoryType.image]: {
    name: "图片",
    icon: ({ className }: { className?: string }) => {
      return <Image className={className} />;
    },
  },
  [CategoryType.files]: {
    name: "文件",
    icon: ({ className }: { className?: string }) => {
      return <Paperclip className={className} />;
    },
  },
};
