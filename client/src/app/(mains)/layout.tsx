import cls from './layout.module.scss'
import { Header } from '@components/layout/header/header';
import { Footer } from '@components/layout/footer/footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header/>
      {children}
      <Footer/>
    </div>
  );
}