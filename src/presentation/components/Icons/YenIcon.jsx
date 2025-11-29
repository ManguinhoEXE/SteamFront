export const YenIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="square"
    strokeLinejoin="miter"
  >
    {/* Ramas en V */}
    <line x1="5" y1="4" x2="12" y2="14" />
    <line x1="19" y1="4" x2="12" y2="14" />
    {/* Barras horizontales */}
    <line x1="6" y1="16" x2="18" y2="16" />
    <line x1="6" y1="19" x2="18" y2="19" />
    {/* Línea vertical */}
    <line x1="12" y1="18" x2="12" y2="28" />
  </svg>
);
