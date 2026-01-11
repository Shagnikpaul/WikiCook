import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignupForm } from '@/components/ui/sign-up-form';


export const Route = createFileRoute('/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/gradient.png')] gap-3.5" >

      <div className='flex justify-center w-full'>
        <div className='flex flex-col  lg:w-2/8 w-7/8 md:5/8'>

          <div className='flex justify-center w-full'>
            <div className='flex flex-col mb-5'>

              <div className='flex justify-center mb-5'>
                <ChefHat size={50} />
              </div>

              <h2 className='scroll-m-20 text-center text-4xl font-bold tracking-tight text-balance'>Welcome to WikiCook!</h2>
              <h4 className="scroll-m-20 opacity-50 text-sm font-medium tracking-tight text-center">
                New to WikiCook? Create a new account to post and contribute to recipes.
              </h4>
            </div>

          </div>
          <div>
            <SignupForm />
          </div>

        </div>
      </div>
      <div>
        <Link to='/'><Button variant="link"><ArrowLeft size={76} />Go to Home Page</Button></Link>

      </div>
    </div>
  );
}
