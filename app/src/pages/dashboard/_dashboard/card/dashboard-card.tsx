import { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';

export type DashboardCardProps = {
  title: ReactNode;
  subheader?: ReactNode;
  children?: ReactNode;
};

export default function DashboardCard({ title, subheader, children }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subheader}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

