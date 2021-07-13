<script lang="ts">
	import Avatar from '$components/Avatar';
	import type { AuthResponse } from '$typings/auth';
	import type { Participant } from '$typings/trips';

	export let participants: Participant[] = [];
	export let inviteLink: string = '';
</script>

<ul>
	{#each participants as participant (participant._id)}
		<li>
			<Avatar name={`${participant.firstName} ${participant.lastName}`} src={participant.avatar} />
			<i>{participant.firstName} {participant.lastName}</i>
		</li>
	{/each}
	{#if inviteLink}
		<li>
			<a sveltekit:prefetch class="invite-item" href={inviteLink}>
				<Avatar name="+" />
				<i>Invite a friend</i>
			</a>
		</li>
	{/if}
</ul>

<style>
	ul {
		margin: 0;
		padding: 0;
	}
	li {
		margin: 1rem 0;
	}
	li,
	li a {
		list-style: none;
		display: flex;
		align-items: center;
	}
	li i {
		margin-left: 8px;
	}

	li a:hover {
		text-decoration: none;
	}
</style>
