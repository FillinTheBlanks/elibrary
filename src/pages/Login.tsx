import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/http/api";
import useTokenStore from "@/store";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLoginStore from "@/storage";

const LoginPage = () => {
const navigate = useNavigate()

const setToken = useTokenStore((state) => state.setToken)
const setAccount = useLoginStore((state) => state.setAccount)

 const emailRef = useRef<HTMLInputElement>(null);
 const passwordRef = useRef<HTMLInputElement>(null);


 //make server call;
   // Mutations
     const mutation = useMutation({
        mutationFn: login,
        onSuccess: (response) => {
           console.log('login success')
          //  console.log(response);
          console.log(response.data[0]);
           setAccount(response.data[0].admin_id, response.data[0].name, response.data[0].level);
           setToken(response.data[0].accessToken);
           navigate('/dashboard/home');
          },
  })


 const handleLoginSubmit = () => {
     const email = emailRef.current?.value;
     const password = passwordRef.current?.value;
      //console.log({email,password});


  if (!email || !password) {
    return alert('Please enter email and password')
  }
  mutation.mutate({email,password});

 }

  return (
    <section className="flex justify-center items-center h-screen">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.<br/>
          {mutation.isPending && <div>Loading...</div>}
          {mutation.isError && <span className="text-red-500 text-sm ">{mutation.error.message}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input ref={emailRef} id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input ref={passwordRef} id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
         <Button onClick={handleLoginSubmit} className="w-full" disabled={mutation.isPending}>
          {
            mutation.isPending && <LoaderCircle className="animate-spin"/>
          }
          <span className="ml-2">Sign in</span> 
          </Button>
        <div className="mt-4 text-center text-sm">
          don't have account?{" "}
          <Link to={'/auth/register'} className="underline">
            Sign up
          </Link>
        </div>
        </div>
      </CardFooter>
    </Card>
    </section>
  )
}

export default LoginPage