import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { encodePassToken } from '../../../services/bookingApi';

export default function BoardingBarcode({
  booking,
  token: customToken,
  boxClassName = 'mb-bp-qr-box',
  imgClassName = 'mb-bp-qr',
}) {
  const [qrSrc, setQrSrc] = useState('');
  const token = customToken || encodePassToken(booking);
  const baseUrl = import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin;
  const passUrl = `${baseUrl}/boarding-pass?t=${encodeURIComponent(token)}`;

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(passUrl, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: 'L',
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then((url) => {
        if (active) setQrSrc(url);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [passUrl]);

  if (!qrSrc) return null;

  return (
    <div className={boxClassName} title={`Scan boarding pass ${booking.pnr}`}>
      <img
        src={qrSrc}
        alt={`QR code for boarding pass ${booking.pnr}`}
        className={imgClassName}
      />
    </div>
  );
}
