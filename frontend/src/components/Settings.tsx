import { User } from '../types';

interface SettingsProps {
  user: User;
  onUpdate: (user: User) => void;
  darkMode?: boolean;
}

export default function Settings({ user, onUpdate, darkMode = false  }: SettingsProps) {
  return (
    <div>
      {/* ...existing code... */}
      <h2 className="text-xl font-medium">Settings for {user.name}</h2>
    </div>
  );
}