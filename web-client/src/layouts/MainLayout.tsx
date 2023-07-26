const MainLayout: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <div className="flex w-full h-screen justify-center items-center">
      {children}
    </div>
  );
};
export default MainLayout;
