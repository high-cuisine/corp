// components/CustomQRCode.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';

type CustomQRCodeProps = {
  value: string;
  size?: number;
  fgColor?: string; // цвет модулей (по умолчанию чёрный)
  bgColor?: string; // фон (по умолчанию прозрачный)
};

export default function CustomQRCode({
  value,
  size = 300,
  fgColor = '#000000',
  bgColor = 'transparent', // 🎯 вот здесь делаем фон прозрачным!
}: CustomQRCodeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value || !containerRef.current) return;

    try {
      // Очищаем предыдущий QR-код
      if (qrCodeRef.current) {
        containerRef.current.innerHTML = '';
      }

      const qrCode = new QRCodeStyling({
        width: size,
        height: size,
        type: 'canvas',
        data: value,
        dotsOptions: {
          color: fgColor,
          type: 'square',
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          color: fgColor,
          type: 'square',
        },
        cornersDotOptions: {
          color: fgColor,
          type: 'square',
        },
      });

      qrCodeRef.current = qrCode;
      qrCode.append(containerRef.current);
    } catch (err) {
      console.error('QR Code error:', err);
      setError('Ошибка генерации QR-кода');
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      qrCodeRef.current = null;
    };
  }, [value, size, fgColor, bgColor]);

  if (error) return <div>{error}</div>;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div ref={containerRef} />
    </div>
  );
}