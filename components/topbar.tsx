"use client";

import Image from "next/image";
import logo from "../app/assets/logo.png";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import PasswordInput from "./custompassword";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
import auth from "../app/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { Toaster, toast } from "sonner";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";

export default function Topbar() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const [IsOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  );
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const maxChars = 800;
  const [isloginopen, setIsloginOpen] = useState(false);

  const handleChange = (event: any) => {
    if (event.target.value.length <= maxChars) {
      setDescription(event.target.value);
    }
  };

  const onOpenchange = () => {
    setIsOpen(false);
    setAvatar(
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    );
    setEmail("");
    setPassword("");
    setDescription("");
    setUsername("");
    setStep(1);
  };

  const openLoginDialog = () => {
    setIsOpen(false);
    setIsloginOpen(true);
  };

  const opensignupDialog = () => {
    setIsOpen(true);
    setIsloginOpen(false);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const progressPercentage = (step / 3) * 100;

  const openDialog = () => setIsOpen(true);

  function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  function handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file?.size && file.size > 7 * 1024 * 1024) {
      toast.error("File size is too large. Please upload a file less than 5MB");
    } else {
      if (file) {
        convertImageToBase64(file)
          .then((base64String) => {
            setAvatar(base64String);
          })
          .catch((error) => console.error("Error converting image:", error));
      }
    }
  }

  const registerUserwithEmail = async () => {
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      description === ""
    ) {
      toast.error("Please check your information!");
    } else {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userId = auth.currentUser?.getIdToken;

        sendEmailVerification(auth.currentUser!);

        axios.post(`https://${process.env.API_BASE_URL}/api/v1/createuser`, {
          body: {
            email: email,
            username: username,
            avatar: avatar,
            description: description,
            firebaseId: userId,
            favorite_subjects: ["test"],
            profileCompleted: true,
          },
        });

        toast.success("Thank you for Registering, Check your email");
      } catch (error) {
        toast.error("Error Accoured please try again");
      }
    }
  };

  const isEmailVerified = (user: User) => {
    if (!user.emailVerified) {
      toast.warning("Please Verify your email to continue");
    } else {
      toast.success("Sign In successful");
      router.push("/dashboard");
    }
  };

  const emailSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      isEmailVerified(userCredential.user);
    } catch (err) {
      console.log("Login Failed");
      toast.error("Login Failed please try again");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error("Google Login Failed");
    }
  };

  return (
    <div className="w-full h-14 flex items-center justify-between shadow-custom">
      <Toaster richColors position="top-right" closeButton />
      <Dialog open={IsOpen} onOpenChange={onOpenchange}>
        <DialogContent className="max-w-[400px] w-11/12">
          <DialogTitle className="text-center text-3xl font-light">
            Create Account
          </DialogTitle>

          <div className="flex items-center justify-center">
            <Progress value={progressPercentage} className="w-[250px]" />
          </div>

          {step === 1 && (
            <div className="flex items-center justify-center flex-col">
              <Input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10 placeholder:text-black placeholder:font-light w-[250px] mb-2 focus:font-light font-light"
                placeholder="Email Address"
              />
              <Input
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="pr-10 placeholder:text-black placeholder:font-light w-[250px] mb-2 focus:font-light font-light"
              />
              <PasswordInput onPasswordChange={setPassword} />
            </div>
          )}

          {step === 2 && (
            <div className="flex items-center justify-center flex-col">
              <p className="text-center text-xl font-thin">
                Customize your Profile!
              </p>
              <div className="mt-3 items-center justify-center">
                <Avatar className="w-[150px] h-[150px]">
                  <AvatarImage src={avatar}></AvatarImage>
                </Avatar>
              </div>
              <div>
                <textarea
                  value={description}
                  onChange={handleChange}
                  maxLength={maxChars}
                  placeholder="Tell us more about you"
                  rows={10}
                  cols={23}
                  className="mt-3 resize-none p-2 font-light outline-none placeholder:text-black placeholder:text-sm placeholder:font-light border-[1px] focus:font-thin border-black rounded-lg focus:outline-none"
                />
                <p className="font-thin text-sm">
                  {description.length} / {maxChars}
                </p>
              </div>
              <div className="mt-3">
                <Input
                  onChange={handleFileInput}
                  type="file"
                  accept=".jpg,.png,.jpeg"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex items-center justify-center flex-col">
              <div>
                <p className="text-xl font-thin text-center">Profile Summary</p>
              </div>
              <div className="mt-2">
                <Avatar className="w-[150px] h-[150px]">
                  <AvatarImage src={avatar}></AvatarImage>
                </Avatar>
              </div>
              <div className="text-lg font-thin mt-2 block">
                <p>Email: {email}</p>
                <p>Username: {username}</p>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-between">
            <Button disabled={step === 1} onClick={prevStep}>
              Previous
            </Button>
            {step < 3 ? (
              <Button onClick={nextStep}>Next</Button>
            ) : (
              <Button onClick={registerUserwithEmail}>Submit</Button>
            )}
          </div>
          <div className="mt-2 flex flex-row">
            <p className="font-light">Already have an Account?</p>
            <p
              className="text-[#15D364] ml-1 font-light cursor-pointer"
              onClick={openLoginDialog}
            >
              Sign In
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isloginopen} onOpenChange={setIsloginOpen}>
        <DialogContent className="max-w-[300px] w-11/12">
          <DialogTitle className="text-center text-3xl font-light">
            Sign In
          </DialogTitle>
          <div className="flex items-center justify-center flex-col">
            <Input
              className="pr-10 placeholder:text-black placeholder:font-light w-[250px] mb-2 focus:font-light font-light"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput onPasswordChange={setPassword} />
            <Button className="w-[250px] mt-2" onClick={emailSignIn}>
              Sign In
            </Button>
          </div>
          <div>
            <p className="font-thin text-center">or continue with</p>
            <Button
              onClick={handleGoogleSignIn}
              className="bg-transparent border-2 border-slate-200 hover:bg-opacity-10 hover:bg-slate-800 text-slate-500 w-[250px] h-[40px] mt-2 text-[16px] rounded-lg transition-all duration-300"
            >
              Google
            </Button>
            <p className="text-[9px] text-slate-600 mt-2">
              By signing in with google you accept privacy policy
            </p>
            <p className="font-light flex flex-row text-sm mt-2">
              Not an User?
              <p
                className="ml-2 text-[#15D364] font-light text-sm"
                onClick={opensignupDialog}
              >
                Sign up
              </p>
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex items-center pl-2">
        <Image src={logo} alt="logo" width={48} height={48} />
      </div>
      <div className="flex items-center justify-center">
        <button
          className="pr-4 font-light hover:text-[#15D364] transition-colors duration-300"
          onClick={() => router.push("/about")}
        >
          About
        </button>
        <button
          className="pr-4 font-light hover:text-[#15D364] transition-colors duration-300"
          onClick={() => router.push("/for-students")}
        >
          For Students
        </button>
        <button
          className="font-light hover:text-[#15D364] transition-colors duration-300"
          onClick={() => router.push("/blog")}
        >
          Blog
        </button>
      </div>
      <div className="pr-2">
        <button
          className="font-light pr-2 hover:text-[#15D364] duration-300 transition-colors"
          onClick={openDialog}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
