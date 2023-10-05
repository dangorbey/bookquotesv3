interface SpacerProps {
  height?: number | string;
}

const Spacer: React.FC<SpacerProps> = ({ height = '15px' }) => {
  return <div style={{ height }}></div>;
}

export default Spacer;
