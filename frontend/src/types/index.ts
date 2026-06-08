export interface Review {
  user: string;
  comment: string;
}

export interface BorrowRequest {
  id: string;
  borrower: string;
  title: string;
  purpose: string;
  amount: string;
  promisedDate: string;
  creditScore: number;
  reviews: Review[];
  isMine?: boolean;
}

export interface Loan {
  id: string;
  borrower: string;
  lender: string;
  amount: string;
  dueDate: string;
  status: "active" | "repaid" | "defaulted";
  type: "borrowing" | "lending";
  title: string;
}
