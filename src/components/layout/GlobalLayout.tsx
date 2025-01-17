import { DarkModeToggle, DarkModeStyles } from '@/components/DarkModeToggle';

const GlobalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <DarkModeToggle />
      <DarkModeStyles />
      {children}
    </div>
  );
};

export default GlobalLayout;