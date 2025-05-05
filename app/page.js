// app/page.js
import { redirect } from 'next/navigation';

export default function Home() {
  // This will trigger a server-side redirect to the /login route
  redirect('/login');
  // Since redirect() never returns, you don't need to return any JSX.
}
