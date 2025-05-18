import { User } from './types';

type ProfileHeaderProps = {
  user: User;
};

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white rounded-t-lg">
      <div className="flex flex-col md:flex-row items-center">
        <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-0 md:mr-6">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="rounded-full object-cover border-4 border-white"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl">
              {user.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
          <p className="text-green-100">{user.type === 'admin' ? 'Administrador' : 'Cliente'}</p>
        </div>
      </div>
    </div>
  );
}; 