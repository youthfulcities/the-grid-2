import React, { createContext, ReactNode, useContext, useState } from 'react';
import { BasketEntry } from '../types/BasketTypes';

export interface AvatarOptions {
  hair: string;
  eyes: string;
  mouth: string;
  eyebrows: string;
  nose: string;
  glasses: string;
  skin: string;
  beard: string;
  hairColour: string;
  seed: string;
}

const defaultOptions: AvatarOptions = {
  hair: 'full',
  eyes: 'round',
  mouth: 'smile',
  eyebrows: 'up',
  nose: 'curve',
  glasses: 'none',
  skin: 'ac6651',
  beard: 'none',
  hairColour: '6bd9e9',
  seed: Math.random().toString(36).substring(2, 10),
};

interface ProfileContextType {
  avatar: AvatarOptions;
  setAvatar: React.Dispatch<React.SetStateAction<AvatarOptions>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
  occupation: string;
  student: boolean | null;
  setStudent: React.Dispatch<React.SetStateAction<boolean | null>>;
  car: boolean | null;
  setCar: React.Dispatch<React.SetStateAction<boolean | null>>;
  setOccupation: React.Dispatch<React.SetStateAction<string>>;
  age: number;
  setAge: React.Dispatch<React.SetStateAction<number>>;
  customized: boolean;
  setCustomized: React.Dispatch<React.SetStateAction<boolean>>;
  activeCity: string | null;
  setActiveCity: React.Dispatch<React.SetStateAction<string | null>>;
  manIncome: number;
  setManIncome: React.Dispatch<React.SetStateAction<number>>;
  currentIncome: number;
  setCurrentIncome: React.Dispatch<React.SetStateAction<number>>;
  basket: Record<string, BasketEntry>;
  setBasket: React.Dispatch<React.SetStateAction<Record<string, BasketEntry>>>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [avatar, setAvatar] = useState<AvatarOptions>(defaultOptions);
  const [gender, setGender] = useState<string>('woman');
  const [occupation, setOccupation] = useState<string>('0');
  const [age, setAge] = useState<number>(19);
  const [car, setCar] = useState<boolean | null>(null);
  const [student, setStudent] = useState<boolean | null>(null);
  const [customized, setCustomized] = useState<boolean>(false);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [manIncome, setManIncome] = useState<number>(0);
  const [currentIncome, setCurrentIncome] = useState<number>(0);
  const [basket, setBasket] = useState<Record<string, BasketEntry>>({});

  const contextValue = React.useMemo(
    () => ({
      avatar,
      setAvatar,
      gender,
      setGender,
      occupation,
      setOccupation,
      age,
      setAge,
      customized,
      setCustomized,
      activeCity,
      setActiveCity,
      manIncome,
      setManIncome,
      currentIncome,
      setCurrentIncome,
      basket,
      setBasket,
      car,
      setCar,
      student,
      setStudent,
    }),
    [
      avatar,
      gender,
      occupation,
      age,
      customized,
      activeCity,
      manIncome,
      currentIncome,
      basket,
      student,
      car,
    ]
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
