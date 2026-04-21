"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await signIn.email(
          {
            email: value.email,
            password: value.password
          },
          {
            onSuccess: () => {
              toast.success("Welcome back to Planora!");
              router.push("/dashboard");
            },
            onError: (ctx) => {
              toast.error(ctx.error.message || "Login failed. Check your credentials.");
            },
          }
        );
      } catch (error) {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      toast.error("Failed to connect with Google.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50 bg-card/50 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-black tracking-tight">
            Sign In
          </CardTitle>
          <CardDescription>
            Access your events and dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {/* Social Login */}
          <Button
            variant="outline"
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-11 rounded-xl flex items-center justify-center gap-3 border-border hover:bg-secondary hover:text-foreground transition-all group"
          >
            <FaGoogle className="w-5 h-5 text-[#4285F4] group-hover:scale-110 transition-transform" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground italic text-[10px]">
                or use email
              </span>
            </div>
          </div>

          {/* TanStack Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/30" />
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.name}>Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-[10px] text-primary hover:underline font-medium"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground/30" />
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full h-11 rounded-xl text-md font-bold transition-all active:scale-95"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>

        </CardContent>

        <CardFooter className="flex flex-col gap-2 pb-8">
          <p className="text-sm text-muted-foreground text-center">
            New here?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              Create account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
