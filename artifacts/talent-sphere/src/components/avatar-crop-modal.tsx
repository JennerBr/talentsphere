import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AvatarCropModalProps {
  imageSrc: string | null;
  onClose: () => void;
  onConfirm: (croppedFile: File) => void;
  isUploading: boolean;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 80 }, 1, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedBlob(
  image: HTMLImageElement,
  pixelCrop: PixelCrop
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const size = Math.min(512, pixelCrop.width, pixelCrop.height);
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Falha ao gerar imagem recortada"));
      },
      "image/jpeg",
      0.92
    );
  });
}

export function AvatarCropModal({ imageSrc, onClose, onConfirm, isUploading }: AvatarCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  }, []);

  const handleConfirm = async () => {
    if (!imgRef.current || !completedCrop) return;
    try {
      const blob = await getCroppedBlob(imgRef.current, completedCrop);
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      onConfirm(file);
    } catch {
      // silently ignore — parent will show error if upload fails
    }
  };

  return (
    <Dialog open={!!imageSrc} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Recortar foto de perfil</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center py-4 overflow-hidden">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
              minWidth={60}
              minHeight={60}
              className="max-h-[360px]"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Pré-visualização"
                onLoad={onImageLoad}
                className="max-h-[360px] max-w-full object-contain"
              />
            </ReactCrop>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center -mt-2">
          Arraste e redimensione a área para enquadrar sua foto.
        </p>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isUploading || !completedCrop}>
            {isUploading
              ? <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enviando...</span>
              : "Recortar e salvar"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
