export function uploadImage(imageFiles: File[]): Promise<{
  state: "success" | "error";
  url?: string;
  error?: {
    code: string;
    message: string;
  };
}> {
  return new Promise((resolve) => {
    if (imageFiles.length > 0) {
      const imageFile = imageFiles[0];
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageSrc = e.target?.result;
          if (imageSrc) {
            try {
              const response = await fetch("https://s.kuku.lu/server.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body:
                  "action=sendScreenShot&format=png&data_b64url=" +
                  encodeURIComponent(imageSrc as string),
              });

              const data = await response.text();

              if (data.indexOf("OK:") === 0) {
                const url = data.split("OK:")[1];
                if (url) {
                  const url2 = url.replace("http://s.kuku.lu/", "");
                  const finalUrl = "https://s.kuku.lu/image.php/" + url2;
                  resolve({ state: "success", url: finalUrl });
                } else {
                  resolve({
                    state: "error",
                    error: {
                      code: "server_error",
                      message:
                        "サーバー側でエラーが発生しました。再度お試しください。",
                    },
                  });
                }
              } else {
                resolve({
                  state: "error",
                  error: {
                    code: "server_error",
                    message:
                      "サーバー側でエラーが発生しました。再度お試しください。",
                  },
                });
              }
            } catch (error) {
              resolve({
                state: "error",
                error: {
                  code: "server_error",
                  message: `サーバー側でエラーが発生しました。再度お試しください。(Catched: ${error})`,
                },
              });
            }
          }
        };
        reader.readAsDataURL(imageFile);
      } else {
        resolve({
          state: "error",
          error: {
            code: "no_file",
            message: "ファイルが選択されていません。",
          },
        });
      }
    } else {
      resolve({
        state: "error",
        error: {
          code: "no_file",
          message: "ファイルが選択されていません。",
        },
      });
    }
  });
}