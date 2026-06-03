import { ReactNode } from "react";

type BookingLayoutProps = {
  children: ReactNode;
};

export default function BookingLayout({ children }: BookingLayoutProps) {
  return <>{children}</>;
}
