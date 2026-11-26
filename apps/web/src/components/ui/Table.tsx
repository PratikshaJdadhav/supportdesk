import type { ReactNode } from "react";

type TableProps = {
  children: ReactNode;
};

export function Table({ children }: TableProps) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        {children}
      </table>
    </div>
  );
}
