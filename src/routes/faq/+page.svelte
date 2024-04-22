<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index';
	import { Button } from '$lib/components/ui/button';
</script>

<style>
    main {
        background-color: hsla(222, 83%, 4%, 1);
        background-image: radial-gradient(at 50% 40%, hsla(175, 84%, 32%, 0.45) 0px, transparent 50%),
        radial-gradient(at 7% 12%, hsla(175, 84%, 32%, 0) 0px, transparent 50%);
    }
</style>

<main class="flex justify-center items-center flex-col">
	<div class="px-6 py-10 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<p class="text-base font-semibold leading-7 text-primary">Get the help you need</p>
			<h2 class="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">Frequently asked questions</h2>
			<p class="mt-6 text-lg leading-8 text-gray-500">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
				lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p>
		</div>
	</div>

	<Accordion.Root class="w-full sm:max-w-[70%]">
		<Accordion.Item value="item-1">
			<Accordion.Trigger>Can you add certain content to PixelDock?</Accordion.Trigger>
			<Accordion.Content>Sorry, we provide no content ourselves, but the more community plugins you install, the more
				information and features you will be able to access. Our platform thrives on community contributions, from app
				plugins to feedback-driven improvements, ensuring a personalized and enriched gaming experience.
			</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-2">
			<Accordion.Trigger>How Can i make a plugin?</Accordion.Trigger>
			<Accordion.Content>Coming Soon</Accordion.Content>
		</Accordion.Item>
		<Accordion.Item value="item-3">
			<Accordion.Trigger>Where can i get help?</Accordion.Trigger>
			<Accordion.Content>Join us on discord and
				<Button variant="link" class="m-0 px-0" href="https://discord.com/">ask for help</Button>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</main>
