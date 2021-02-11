export interface IBlockFormProps {
  head?: string;
  text?: string;
  isActive?: boolean;
  addBtn?: React.ReactNode;
  onSave?: (value: string) => void;
  className?: string;
}