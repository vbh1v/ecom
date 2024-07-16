import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { signIn } from "next-auth/react";


const LoginPage = () => {
  const signUp = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string | undefined;
    const email = formData.get("email") as string | undefined;
    const password = formData.get("password") as string | undefined;

    console.log(formData);

    if (!email || !password || !name)
      throw new Error("Please provide all fields");

    try {
      const response = await axios.post(
        `http://localhost:3007/api/auth/signup`,
        formData
      );
      console.log("Signup successful:", response.data);
      // Handle successful signup, e.g., redirect to login page
    } catch (error) {
      console.error("Signup error:", error);
      // Handle signup error, e.g., display an error message
    }

    const response = await axios.post(`http://localhost:3007/api/auth/signup`);
  };

  const loginHandler = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string | undefined;
    const password = formData.get("password") as string | undefined;

    // if (!email || !password)
    //   throw new Error("Please provide all fields")
    // console.log(email)

    try {
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        redirectTo: "/",
      });
    } catch (error) {
      // this is what seems to be returning the error message "CallbackRouteError"
      throw error;
    }
  };

  return (
    <div className="flex justify-center">
      <Tabs defaultValue="signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Login to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <form action={loginHandler}>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" />
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input name="password" type="password" />
                </div>
                <div className="space-y-1">
                  <Button className="w-full mt-4">Sign in</Button>
                </div>
              </form>
            </CardContent>
            <form action="">
              <CardFooter className="flex-col space-y-2">
                <Label>OR</Label>
                <Button className="w-full" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Sign in with google
                </Button>
              </CardFooter>
            </form>
            <Label>
              <Link
                href="/signup"
                className="flex justify-center items-center mb-4"
              >
                Don't have an account yet? Sign up.
              </Link>
            </Label>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>Sign up into your account </CardDescription>
            </CardHeader>
            <form action={signUp}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="Name">Your Name</Label>
                  <Input id="name" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="Email">Email</Label>
                  <Input id="email" />
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    placeholder="password"
                    name="password"
                    type="password"
                  />
                </div>
                {/* <div className="space-y-1">
                <Label>Re-enter password</Label>
                <Input type="password" />
              </div> */}
              </CardContent>
              <CardFooter>
                <Button className="w-full">Continue</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginPage;
