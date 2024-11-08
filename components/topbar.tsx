"use client";

import Image from "next/image";
import logo from "../app/assets/logo.png";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { use, useState } from "react";
import { Input } from "./ui/input";
import PasswordInput from "./custompassword";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "../app/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { Toaster, toast } from "sonner";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios";


export default function Topbar() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const [IsOpen, setIsOpen] =  useState(false);
  const [step, setStep] = useState(1);
  const [Password, setPassword] = useState("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [firebaseid, setfirebaseid] = useState<string>("");
  const [selectedOption, setSelectedOption]= useState<string>("");
  const [avatar, setAvatar] = useState<string>("https://github.com/shadcn.png");


  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };


  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const progressPercentage = (step / 3) * 100;

  const openDialog = () => setIsOpen(true);
  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setSelectedOption(value);
  }

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
    if (file?.size && file.size > 5 * 1024 * 1024 ) {
      toast.error("File size is too large. Please upload a file less than 5MB")
    } else {
      if (file) {
        convertImageToBase64(file)
          .then((base64String) => {
            setAvatar(base64String)
          })
          .catch((error) => console.error('Error converting image:', error));
      }
    }
  }

  const registerUserwithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, Password);
      const user = userCredential.user;
      sendEmailVerification(user);
      setfirebaseid(user.uid);
      toast.success("Account created successfully");
      axios.post("http://localhost:3001/api/create-user", {
        email: email,
        username: username,
        avatar: avatar,
        region: selectedOption,
        firebaseId: firebaseid,
        favoriteSubjects: [],
      })
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("An error occured while creating your account");
    }
  }

  return (
    <div className="w-full h-14 flex items-center justify-between shadow-custom">
      <Toaster richColors position="top-right" closeButton />
      <Dialog open={IsOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogTitle className="text-center text-3xl font-light">Create Account</DialogTitle>
        {/* Progress Bar */}
        <div className="flex items-center justify-center">
          <Progress value={progressPercentage} className="w-[350px]"/>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="flex justify-center items-center flex-col">
            <p className="text-center text-2xl font-light mb-4 mt-4">Fill Account Details</p>
            <Input className="pr-10 placeholder:text-black placeholder:font-light w-[350px] mt-3" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)}/>
            <Input className="pr-10 placeholder:text-black placeholder:font-light w-[350px] mt-3 mb-3" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
            <PasswordInput onPasswordChange={setPassword}/>
          </div>
        )}

        {step === 2 && (
          <div className="flex justify-center items-center flex-col">
            <p>Customize your Profile</p>
            <Avatar className="w-[150px] h-[150px] mt-2 mb-2">
              <AvatarImage src={avatar}/>
            </Avatar>
            <Input type="file" className="w-[350px]" onChange={handleFileInput} accept=".png,.jpg,.jpeg"/>
            <select value={selectedOption} onChange={handleInputChange} className="font-light w-[350px] mt-2 flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">Choose Account Region</option>
                <option value="world">🌎 World</option>
                <option value="asia">🌏 Asia</option>
                <option value="africa">🌍 Africa</option>
                <option value="europe">🇪🇺 Europe</option>
                <option value="scandinavia">🇳🇴 Scandinavia</option>
                <option value="northamerica">🇨🇦 North America</option>
                <option value="unitedstate">🇺🇸 United States</option>
                <option value="mexico">🇲🇽 Mexico</option>
                <option value="southamerica">🇨🇱 South America</option>
                <option value="australia">🇦🇺 Australia</option>
                <option value="oceania">🇳🇿 Oceania</option>
                <option value="middleeast">🇦🇪 Middle East</option>
                <option value="russia">🇷🇺 Russia</option>
              </select>
          </div>
        )}

        {step === 3 && (
          <div className="flex justify-center items-center flex-col">
            <p className="text-center font-light text-2xl">Account Details Summary</p>
            <Avatar className="w-[150px] h-[150px] mt-2 mb-2">
              <AvatarImage src={avatar} alt="avatar" />
            </Avatar>
            <p className="font-light text-xl">Email: {email}</p>
            <p className="font-light text-xl">Username: {username}</p>
          </div>
        )}

        {/* Navigation Buttons */}
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
          <p className="text-[#15D364] ml-1 font-light">Sign In</p>
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
          Sign In
        </button>
      </div>
    </div>
  );
}
