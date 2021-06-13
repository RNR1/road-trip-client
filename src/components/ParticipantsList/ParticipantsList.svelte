<script lang="ts">
	import Avatar from '$components/Avatar';
	import type { AuthResponse } from '$typings/auth';

	export let participants: AuthResponse[] = [];
</script>

<ul>
	{#each participants as participant (participant.id)}
		<li>
			<Avatar name={`${participant.firstName} ${participant.lastName}`} src={participant.avatar} />
			<i>{participant.firstName} {participant.lastName}</i>
		</li>
	{/each}
</ul>

<style>
	ul {
		margin: 0;
		padding: 0;
	}
	li {
		list-style: none;
		display: flex;
		align-items: center;
	}
	li i {
		margin-left: 8px;
	}
</style>
