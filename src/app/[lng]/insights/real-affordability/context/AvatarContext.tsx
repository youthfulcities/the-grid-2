// AvatarProvider.tsx (optional: for global sharing via context)
import React, { createContext, useContext, useState } from 'react';
import { AvatarOptions } from '../types/AvatarOptions';

const defaultOptions: AvatarOptions = {
  seed: 'initial',
  hair: 'full',
  eyes: 'round',
  mouth: 'smile',
  eyebrows: 'up',
  nose: 'curve',
  glasses: 'none',
  skin: 'ac6651',
  beard: 'none',
  hairColour: '6bd9e9',
};

const AvatarContext = createContext<{
  avatar: AvatarOptions;
  setAvatar: React.Dispatch<React.SetStateAction<AvatarOptions>>;
}>({
  avatar: defaultOptions,
  setAvatar: () => {},
});

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [avatar, setAvatar] = useState<AvatarOptions>(defaultOptions);
  const contextValue = React.useMemo(
    () => ({ avatar, setAvatar }),
    [avatar, setAvatar]
  );

  return (
    <AvatarContext.Provider value={contextValue}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => useContext(AvatarContext);
