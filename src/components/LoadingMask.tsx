import { Spinner } from "react-bootstrap";

const LoadingMask = () => {
  return (
    <div
      style={{ width: "100vw", height: "100vh", zIndex: 10 }}
      className="LoadingMask position-fixed d-flex justify-content-center align-items-center"
    >
      <Spinner animation="border" variant="light" />
    </div>
  );
};

export default LoadingMask;
