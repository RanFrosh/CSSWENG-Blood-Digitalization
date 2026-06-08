"use client"
import { supabase } from "@/db/supa";
import { ChangeEvent, useState } from "react";
import { profiles as profileSchema } from "@/db/models/profiles";
import { InferSelectModel } from 'drizzle-orm';
import { testing } from "./action";

type Profile = InferSelectModel<typeof profileSchema>;

export default function Home() {
  const [error, setError] = useState("");
  const [namer, setNamer] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [roler, setRoler] = useState("");
  const [profileList, setProfileList] = useState<Profile[]>([]);
  async function name() {
     const { data, error } = await supabase.from("profiles").select("*");
     if (error) {
      setError("Could not fetch profiles");
      } else {
        setProfileList(data); 
      }
  }
  async function name1() {
     setProfileList([]);
  }
  async function handleSignup(e: React.SubmitEvent) {
    e.preventDefault();
    try {
      await testing(namer, email, roler, password);
      name();
    } catch (error: any) {
      alert(error.message);
    }
  }
  return (
    <>
    <button onClick={name1}>
      Hide list of users.
    </button>
    <button onClick={name}>
      Show list of users.
    </button>
    <div>
      Testing user creation and authentication.
      {error}
      <ul>
      {profileList.map((profile) => (
        <li key={profile.id}>
          {profile.name}
        </li>
      ))} 
      </ul>
    </div>
    <form onSubmit={handleSignup}>
      <input
        type="name"
        placeholder="name"
        value={namer}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNamer(e.target.value)}>
      </input>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}>
      </input>
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}>
      </input>
      <input
        type="text"
        placeholder="roler"
        value={roler}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setRoler(e.target.value)}>
      </input>
      <button type="submit">
        Sign up
      </button>
      <button type="submit">
        Sign in
      </button>
    </form>
    </>
  );
}
