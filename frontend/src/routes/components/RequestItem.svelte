<script lang="ts">
	export let request: {
		method: string;
		path: string;
		timestamp: number;
		headers: Record<string, string>;
		query: Record<string, string>;
		body: any;
	};
	export let formatTimestamp: (timestamp: number) => string;

	let isDetailsVisible = false;

	// Format JSON for display
	function formatJSON(obj: any): string {
		if (!obj) return 'null';
		try {
			return JSON.stringify(obj, null, 2);
		} catch (e) {
			return 'Error formatting JSON';
		}
	}
</script>

<div class="request-item">
	<div class="request-header">
		<div class="request-method method-{request.method}">{request.method}</div>
		<div class="request-path">{request.path}</div>
		<div class="request-time">{formatTimestamp(request.timestamp)}</div>
		<button class="toggle-btn" on:click={() => (isDetailsVisible = !isDetailsVisible)}>
			{isDetailsVisible ? 'Hide' : 'Details'}
		</button>
	</div>

	{#if isDetailsVisible}
		<div class="request-details">
			<div class="detail-section">
				<h3>Headers</h3>
				<pre class="request-headers">{formatJSON(request.headers)}</pre>
			</div>
			<div class="detail-section">
				<h3>Query Parameters</h3>
				<pre class="request-query">{formatJSON(request.query)}</pre>
			</div>
			<div class="detail-section">
				<h3>Body</h3>
				<pre class="request-body">{formatJSON(request.body)}</pre>
			</div>
		</div>
	{/if}
</div>

<style>
	.request-item {
		background-color: #ebe5c2;
		border: 1px solid #b9b28a;
		border-radius: 4px;
		margin-bottom: 15px;
		overflow: hidden;
	}

	.request-header {
		display: flex;
		align-items: center;
		padding: 12px 15px;
		background-color: #ebe5c2;
		gap: 10px;
	}

	.request-method {
		font-weight: 600;
		padding: 4px 8px;
		border-radius: 4px;
		color: white;
		min-width: 70px;
		text-align: center;
	}

	:global(.method-GET) {
		background-color: #4caf50;
	}
	:global(.method-POST) {
		background-color: #2196f3;
	}
	:global(.method-PUT) {
		background-color: #ff9800;
	}
	:global(.method-DELETE) {
		background-color: #f44336;
	}
	:global(.method-OTHER) {
		background-color: #9c27b0;
	}

	.request-path {
		flex-grow: 1;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.request-time {
		font-size: 0.85rem;
		color: #504b38;
		opacity: 0.8;
	}

	.request-details {
		padding: 15px;
		border-top: 1px solid #b9b28a;
		background-color: #f8f3d9;
	}

	.detail-section {
		margin-bottom: 15px;
	}

	.detail-section h3 {
		margin-bottom: 5px;
		font-size: 1rem;
	}

	pre {
		background-color: #ebe5c2;
		padding: 10px;
		border-radius: 4px;
		overflow-x: auto;
		font-family: 'Berkeley Mono Variable', monospace;
		font-size: 0.9rem;
		border: 1px solid #b9b28a;
	}
</style>
