import axios, { AxiosRequestConfig } from 'axios';

const ENDPOINT = globalThis.API_URL || 'http://localhost:3000/api';
axios.defaults.withCredentials = true;

export type User = {
  user: any;
};

export type Transaction = {
  date: number;
  value: number;
};

export class Client {
  public async getUser(): Promise<User | undefined> {
    const res = await this.fetch('/auth/user');
    return res.data;
  }

  public async signup(username: string, password: string): Promise<User | undefined> {
    const { data } = await this.fetch('/auth/signup', {
      method: 'POST',
      data: {
        username,
        password,
      },
    });
    return data.user;
  }

  public async login(username: string, password: string): Promise<User | undefined> {
    const { data } = await this.fetch('/auth/login', {
      method: 'POST',
      data: {
        username,
        password,
      },
    });
    return data.user;
  }

  public async logout(): Promise<void> {
    await this.fetch('/auth/logout', {
      method: 'POST',
    });
  }

  public async getTransactions(): Promise<Transaction[] | undefined> {
    const res = await this.fetch('/transactions/');
    return res.data.transactions;
  }

  public async insertTransaction(transaction: Transaction): Promise<Transaction | undefined> {
    const { data } = await this.fetch('/transactions/', {
      method: 'POST',
      data: transaction,
    });
    return data.transaction;
  }

  public async deleteTransaction(transactionId: string): Promise<string | undefined> {
    const { data } = await this.fetch('/transactions/' + transactionId, {
      method: 'DELETE',
    });
    return data.id;
  }

  private async fetch(path: string, config?: Partial<AxiosRequestConfig>, _disableToken?: boolean) {
    return await axios.request({
      method: 'GET',
      baseURL: ENDPOINT,
      url: path,
      ...config,
    });
    // const token = await auth0.getTokenSilently()
    // return await axios(ENDPOINT + path, {
    //   ...options,
    //   headers: {
    //     // ...(token && !disableToken ? { Authorization: `Bearer ${token}` } : undefined),
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Credentials': 'true',
    //     ...(options ? options.headers : undefined),
    //   },
    // });
  }
}

export const client = new Client();
