import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "../components/ButtonComponent";
import Input from "../components/Input";
import MainLayout from "../layouts/MainLayout";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { emitMessage, onMessage } from "../utils/socket";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Pls, fill the name" }),
});

type LoginSchema = z.infer<typeof loginSchema>;
const Login: React.FC = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: LoginSchema) => {
    const { username } = data;
    setLoading(true);
    emitMessage("login", { username });
  };

  useEffect(() => {
    const loginListener = onMessage(
      "login",
      (data: { success: boolean; sessionId: string; username: string }) => {
        setLoading(false);
        if (data.success) {
          localStorage.setItem("sessionId", data.sessionId);
          localStorage.setItem("username", data.username);
          navigate("/dashboard");
        }
      }
    );

    return () => {
      loginListener();
    };
  }, [navigate]);

  return (
    <MainLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" w-full flex flex-col gap-3 max-w-xs justify-center">
          <Controller
            name="username"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Your name"
                label="Name"
                onChange={onChange}
                value={value}
                error={errors.username?.message}
              />
            )}
          />
          <Button title="Login" type="submit" disabled={loading} />
        </div>
      </form>
    </MainLayout>
  );
};

export default Login;
