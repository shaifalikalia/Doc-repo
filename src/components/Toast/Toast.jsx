import React from "react";
import { Toaster } from "react-hot-toast";

export function ToastRenderer() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2200,
      }}
      containerStyle={{
        top: 100,
      }}
    />
  );
}
