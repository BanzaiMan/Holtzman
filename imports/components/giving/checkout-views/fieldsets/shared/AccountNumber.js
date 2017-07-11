// @flow

type IAccountNumber = {
  accountNumber: string,
};

const AccountNumber = ({ accountNumber }: IAccountNumber) =>
  <span>
    {accountNumber.slice(0, accountNumber.length - 5).replace(/./gim, "*")}
    {accountNumber.slice(-4)}
  </span>;

export default AccountNumber;
