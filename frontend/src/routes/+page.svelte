<script lang="ts">
	import { onMount } from 'svelte';
	import RequestItem from './components/RequestItem.svelte';

	let requests: any[] = [];
	let requestCount = 0;

	// Format timestamp to readable date
	function formatTimestamp(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleString();
	}

	// Load requests from server
	async function loadRequests() {
		try {
			const response = await fetch('/api/requests');
			if (!response.ok) throw new Error('Failed to fetch requests');

			requests = await response.json();
			requestCount = requests.length;
		} catch (error) {
			console.error('Error loading requests:', error);
			requests = [];
		}
	}

	// Set up polling for new requests (every 10 seconds)
	onMount(() => {
		loadRequests();
		const interval = setInterval(loadRequests, 10000);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Antenna</title>
</svelte:head>

<header>
	<h1>Antenna</h1>
	<div class="controls">
		<button on:click={loadRequests}>Refresh</button>
		<button on:click={() => (requests = [])}>Clear View</button>
	</div>
</header>

<main>
	<div id="requests-container">
		{#if requests.length === 0}
			<div class="loading">No requests captured yet. Try making some requests to this server!</div>
		{:else}
			{#each requests as request (request.id)}
				<RequestItem {request} {formatTimestamp} />
			{/each}
		{/if}
	</div>
</main>

<footer>
	<p>Antenna • <span>{requestCount}</span> requests captured</p>
</footer>

<style>
	@font-face {
		font-family: 'Berkeley Mono Variable';
		src: url('/berkeley-mono-variable.woff2') format('woff2');
		font-weight: 100 900;
		font-style: normal;
	}

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: 'Berkeley Mono Variable', monospace;
		background-color: #f8f3d9;
		color: #504b38;
		line-height: 1.6;
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 0;
		border-bottom: 2px solid #b9b28a;
		margin-bottom: 20px;
	}

	h1 {
		font-size: 1.8rem;
		font-weight: 600;
	}

	:global(button) {
		background-color: #ebe5c2;
		border: 1px solid #b9b28a;
		color: #504b38;
		padding: 8px 12px;
		cursor: pointer;
		font-family: 'Berkeley Mono Variable', monospace;
		font-size: 0.9rem;
		transition: background-color 0.2s;
	}

	:global(button:hover) {
		background-color: #b9b28a;
	}

	.controls {
		display: flex;
		gap: 10px;
	}

	main {
		min-height: calc(100vh - 180px);
	}

	footer {
		text-align: center;
		margin-top: 30px;
		padding-top: 20px;
		border-top: 2px solid #b9b28a;
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.loading {
		text-align: center;
		padding: 40px;
		font-style: italic;
		opacity: 0.7;
	}
</style>
