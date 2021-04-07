<script>
  import axios from 'axios';
  import Transaction from '../components/Transaction.svelte';
  import SummaryCard from '../components/SummaryCard.svelte';
  import Loading from '../components/Loading.svelte';
  import { onMount } from 'svelte';
  import { transactions, sortedTransactions, income, expenses, balance } from '../stores';
  import { client } from '../lib/client';

  let input = 0;
  let typeOfTransaction = '+';
  let loading = false;

  $: disabled = !input;

  onMount(async () => {
    loading = true;
    $transactions = await client.getTransactions();
    loading = false;
  });

  async function addTransaction() {
    const transaction = {
      date: new Date().getTime(),
      value: typeOfTransaction === '+' ? input : input * -1,
    };
    const newTransaction = await client.insertTransaction(transaction);
    $transactions = [newTransaction, ...$transactions];
    input = 0;
  }
  async function removeTransaction(id) {
    const deletedId = await client.deleteTransaction(id);
    if (deletedId === id) {
      $transactions = $transactions.filter((t) => t._id !== id);
    }
  }
</script>

<div class="app container">
  <div class="field has-addons">
    <p class="control">
      <span class="select">
        <select bind:value={typeOfTransaction}>
          <option value="+">+</option>
          <option value="-">-</option>
        </select>
      </span>
    </p>
    <p class="control is-expanded">
      <input class="input" type="number" bind:value={input} placeholder="Amount of money" />
    </p>
    <p class="control">
      <button class="button" on:click={addTransaction} {disabled}>Save</button>
    </p>
  </div>
  {#if loading}
    <Loading />
  {/if}

  {#if $transactions.length > 0}
    <SummaryCard mode="balance" value={$balance} />

    <div class="columns">
      <div class="column">
        <SummaryCard mode="income" value={$income} />
      </div>
      <div class="column">
        <SummaryCard mode="expenses" value={$expenses} />
      </div>
    </div>
    <hr />
  {:else if !loading}
    <div class="notification">Add your first transaction</div>
  {/if}

  {#each $sortedTransactions as transaction (transaction._id)}
    <Transaction {transaction} {removeTransaction} />
  {/each}
</div>

<style>
  .app {
    margin: 40px auto;
  }
</style>
