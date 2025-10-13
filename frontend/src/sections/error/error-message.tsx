import { Alert } from "@mui/material";


const ErrorMessage = ({ variant = "outlined", children }: {variant: "outlined" | "standard" | "filled", children: any}) => (
    <Alert variant={variant} style={{ fontSize: 20 }} color="error" icon={false}>
      <strong>{children}</strong>
    </Alert>
  );

export default ErrorMessage;
