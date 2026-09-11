<script module lang="ts">
  export type TalkStat = { label: string; value: string };
  export type TalkAffix = { text: string; tier?: string };
  export type TalkAction = {
    label: string;
    href: string;
    type: 'video' | 'slides' | 'lab' | 'article';
    eyebrow?: string;
    newTab?: boolean;
  };
  export type TalkGachaCardProps = {
    title: string;
    subtitle?: string;
    event?: string;
    date?: string;
    dateTime?: string;
    location?: string;
    rarity?: number;
    rarityLabel?: string;
    rarityDescription: string;
    featuredLabel: string;
    element?: string;
    className?: string;
    headingLevel?: 2 | 3;
    stats: TalkStat[];
    affixes: TalkAffix[];
    affixesLabel: string;
    description?: string;
    actions: TalkAction[];
    inspectLabel: string;
    closeLabel: string;
    note?: string;
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import '../styles/talk-gacha.css';

  let {
    title,
    subtitle,
    event,
    date,
    dateTime,
    location,
    rarity = 5,
    rarityLabel,
    rarityDescription,
    featuredLabel,
    element,
    className = '',
    headingLevel = 2,
    stats,
    affixes,
    affixesLabel,
    description,
    actions,
    inspectLabel,
    closeLabel,
    note,
  }: TalkGachaCardProps = $props();

  const uid = $props.id();
  let expanded = $state(false);
  let ready = $state(false);
  const stars = $derived(Math.max(0, Math.min(5, Math.round(Number.isFinite(rarity) ? rarity : 5))));
  onMount(() => {
    ready = true;
  });
</script>

<article
  aria-labelledby={`${uid}-title`}
  class={`talk-gacha tw:group tw:relative tw:isolate tw:w-full tw:min-w-0 tw:rounded-sm tw:border tw:border-solid tw:border-[#9e8252]/60 tw:bg-[#100f19] tw:text-[#f4eedf] tw:shadow-[0_16px_48px_-32px_#080610,0_1px_0_#ecd59a33_inset] tw:transition-[border-color,box-shadow] tw:duration-300 tw:hover:border-[#e6c582] tw:hover:shadow-[0_20px_60px_-30px_#33264a,0_0_24px_-16px_#e6c582] tw:focus-within:border-[#e6c582] tw:motion-reduce:transition-none ${className}`}
>
  <div
    aria-hidden="true"
    class="talk-art tw:pointer-events-none tw:absolute tw:inset-0 tw:-z-10 tw:overflow-hidden tw:rounded-[inherit]"
  >
    <div
      class="tw:absolute tw:inset-0 tw:bg-[radial-gradient(ellipse_at_88%_12%,#43336666,transparent_60%),linear-gradient(135deg,#15121f,#100f19_65%)]"
    ></div>
    <div class="talk-grid tw:absolute tw:inset-0 tw:opacity-30"></div>
    <svg
      class="tw:absolute tw:-top-16 tw:-right-20 tw:size-80 tw:text-[#ddbc79]/10"
      viewBox="0 0 320 320"
      fill="none"
    >
      <path
        d="M160 20 300 160 160 300 20 160Z M160 55 265 160 160 265 55 160Z M160 95 225 160 160 225 95 160Z"
        stroke="currentColor"
      />
      <path d="M160 0v320M0 160h320" stroke="currentColor" stroke-dasharray="2 10" />
      <circle cx="160" cy="160" r="110" stroke="currentColor" />
    </svg>
    <div
      class="talk-shimmer tw:absolute tw:top-0 tw:h-px tw:w-1/3 tw:bg-linear-to-r tw:from-transparent tw:via-[#f8de9a] tw:to-transparent tw:opacity-0"
    ></div>
  </div>

  <div class="tw:p-5 tw:sm:p-8">
    <div class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-x-5 tw:gap-y-3">
      <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-3 tw:text-[#e6c582]">
        {#if rarityLabel}
          <span
            class="tw:border tw:border-solid tw:border-[#c2a15f]/50 tw:bg-[#d9b56a]/8 tw:px-2.5 tw:py-1 tw:font-mono tw:text-sm tw:font-bold tw:tracking-[0.12em]"
            >{rarityLabel}</span
          >
        {/if}
        <span class="tw:inline-flex tw:gap-1" role="img" aria-label={rarityDescription}>
          {#each Array(stars) as _}
            <svg aria-hidden="true" class="tw:size-4" viewBox="0 0 20 20" fill="currentColor"
              ><path d="m10 1.5 2.5 5.1 5.6.8-4.1 4 .9 5.6-4.9-2.6-4.9 2.6.9-5.6-4.1-4 5.6-.8Z" /></svg
            >
          {/each}
        </span>
      </div>
      <p
        class="tw:m-0 tw:font-mono tw:text-xs tw:leading-relaxed tw:tracking-[0.12em] tw:text-[#c5b69a] tw:uppercase"
      >
        {featuredLabel}
      </p>
    </div>

    <div class="tw:mt-8 tw:max-w-[38rem]">
      {#if element}
        <p
          class="tw:mb-4 tw:inline-flex tw:items-center tw:gap-2 tw:text-xs tw:font-semibold tw:tracking-[0.12em] tw:text-[#d0c0ed] tw:uppercase"
        >
          <span
            aria-hidden="true"
            class="tw:size-2 tw:shrink-0 tw:rotate-45 tw:border tw:border-solid tw:border-current"
          ></span>{element}
        </p>
      {/if}
      <svelte:element
        this={`h${headingLevel}`}
        id={`${uid}-title`}
        class="tw:m-0 tw:text-[clamp(2rem,5vw,3.75rem)] tw:leading-[1.04] tw:font-semibold tw:tracking-[-0.045em] tw:text-[#fff5e0]"
        >{title}</svelte:element
      >
      {#if subtitle}<p class="tw:mt-3 tw:mb-0 tw:text-lg tw:leading-snug tw:text-[#dacdad] tw:sm:text-xl">
          {subtitle}
        </p>{/if}
      {#if description}<p
          class="tw:mt-5 tw:mb-0 tw:max-w-[60ch] tw:text-base tw:leading-relaxed tw:text-[#bbb4c7]"
        >
          {description}
        </p>{/if}
    </div>

    {#if event || location || date}
      <p
        class="tw:mt-6 tw:mb-0 tw:flex tw:flex-wrap tw:items-baseline tw:gap-x-3 tw:gap-y-1 tw:text-sm tw:leading-relaxed tw:text-[#d6cdbb]"
      >
        {#if event}<span class="tw:font-semibold tw:text-[#f4eedf]">{event}</span>{/if}
        {#if location}<span>{location}</span>{/if}
        {#if date}<time datetime={dateTime}>{date}</time>{/if}
      </p>
    {/if}

    {#if stats.length}
      <dl
        class="tw:mt-6 tw:mb-0 tw:grid tw:grid-cols-1 tw:gap-x-6 tw:gap-y-4 tw:border-y tw:border-solid tw:border-x-0 tw:border-[#c2a15f]/25 tw:py-5 tw:sm:grid-cols-3"
      >
        {#each stats as stat}
          <div class="tw:grid tw:min-w-0 tw:grid-cols-2 tw:items-baseline tw:gap-x-3 tw:sm:block">
            <dt
              class="tw:font-mono tw:text-xs tw:leading-relaxed tw:tracking-[0.1em] tw:text-[#aba2bb] tw:uppercase"
            >
              {stat.label}
            </dt>
            <dd
              class="tw:mt-0 tw:ml-0 tw:text-right tw:text-base tw:leading-snug tw:font-medium tw:text-[#eee4d1] tw:sm:mt-1 tw:sm:text-left"
            >
              {stat.value}
            </dd>
          </div>
        {/each}
      </dl>
    {/if}

    {#if affixes.length}
      <button
        type="button"
        disabled={!ready}
        aria-expanded={expanded}
        aria-controls={`${uid}-affixes`}
        onclick={() => {
          expanded = !expanded;
        }}
        class="tw:mt-5 tw:flex tw:min-h-12 tw:w-full tw:cursor-pointer tw:items-center tw:justify-between tw:gap-4 tw:rounded-xs tw:border tw:border-solid tw:border-[#c2a15f]/40 tw:bg-[#e6c582]/5 tw:px-4 tw:py-3 tw:text-left tw:text-sm tw:font-semibold tw:text-[#e6c582] tw:transition-colors tw:hover:border-[#e6c582] tw:hover:bg-[#e6c582]/10 tw:active:bg-[#e6c582]/15 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-[#f0d294] tw:disabled:cursor-wait tw:motion-reduce:transition-none"
      >
        <span>{expanded ? closeLabel : inspectLabel}</span>
        <svg
          aria-hidden="true"
          class={`tw:size-4 tw:shrink-0 tw:transition-transform tw:duration-200 tw:motion-reduce:transition-none ${expanded ? 'tw:rotate-180' : ''}`}
          viewBox="0 0 16 16"
          fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" /></svg
        >
      </button>
      <div
        id={`${uid}-affixes`}
        aria-hidden={!expanded}
        class={`tw:grid tw:transition-[grid-template-rows,opacity] tw:duration-300 tw:ease-out tw:motion-reduce:transition-none ${expanded ? 'tw:grid-rows-[1fr] tw:opacity-100' : 'tw:grid-rows-[0fr] tw:opacity-0'}`}
      >
        <div class="tw:min-h-0 tw:overflow-hidden">
          <div
            class="tw:mt-3 tw:border tw:border-l-2 tw:border-solid tw:border-[#b59bdb]/60 tw:bg-[#08070f]/45 tw:p-4 tw:sm:p-5"
          >
            <p
              class="tw:mt-0 tw:mb-4 tw:font-mono tw:text-xs tw:tracking-[0.1em] tw:text-[#c5b69a] tw:uppercase"
            >
              {affixesLabel}
            </p>
            <ul class="tw:m-0 tw:list-none tw:space-y-3 tw:p-0">
              {#each affixes as affix}
                <li
                  class="tw:m-0 tw:flex tw:items-start tw:gap-3 tw:text-sm tw:leading-relaxed tw:text-[#d5c8ef]"
                >
                  <span
                    aria-hidden="true"
                    class="tw:mt-2 tw:size-1.5 tw:shrink-0 tw:rotate-45 tw:bg-[#c7a3e6]"
                  ></span>
                  <span class="tw:min-w-0 tw:flex-1"
                    >{affix.text}{#if affix.tier}<span
                        class="tw:ml-2 tw:inline-block tw:font-mono tw:text-xs tw:text-[#dec58f]"
                        >[{affix.tier}]</span
                      >{/if}</span
                  >
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </div>
      <noscript>
        <div class="tw:mt-4 tw:text-[#d5c8ef]">
          <p>{affixesLabel}</p>
          <ul>
            {#each affixes as affix}<li>
                {affix.text}{#if affix.tier}
                  [{affix.tier}]{/if}
              </li>{/each}
          </ul>
        </div>
      </noscript>
    {/if}

    {#if actions.length}
      <div class="tw:mt-6 tw:grid tw:grid-cols-1 tw:gap-3 tw:sm:grid-cols-2">
        {#each actions as action, index}
          <a
            href={action.href}
            target={action.newTab ? '_blank' : undefined}
            rel={action.newTab ? 'noopener noreferrer' : undefined}
            data-action={action.type}
            class={`talk-action tw:relative tw:flex tw:min-h-16 tw:min-w-0 tw:items-center tw:justify-between tw:gap-3 tw:overflow-hidden tw:rounded-xs tw:border tw:border-solid tw:px-5 tw:py-3 tw:no-underline tw:transition-[background-color,border-color,transform] tw:duration-200 tw:active:translate-y-px tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-[#f0d294] tw:motion-reduce:transform-none tw:motion-reduce:transition-none ${index === 0 ? 'tw:border-[#d8ba7c] tw:bg-[#dec38c] tw:text-[#19131e] tw:hover:bg-[#f0d9a4]' : 'tw:border-[#706078] tw:bg-[#221b2b]/70 tw:text-[#f4eedf] tw:hover:border-[#bba7cd] tw:hover:bg-[#30243c]'}`}
          >
            <span class="tw:min-w-0"
              >{#if action.eyebrow}<span
                  class="tw:mb-1 tw:block tw:font-mono tw:text-xs tw:tracking-[0.1em] tw:uppercase"
                  >{action.eyebrow}</span
                >{/if}<span class="tw:block tw:text-base tw:leading-snug tw:font-semibold"
                >{action.label}</span
              ></span
            >
            <svg aria-hidden="true" class="tw:size-5 tw:shrink-0" viewBox="0 0 24 24" fill="none"
              ><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.5" /></svg
            >
          </a>
        {/each}
      </div>
    {/if}
    {#if note}<p class="tw:mt-5 tw:mb-0 tw:text-xs tw:leading-relaxed tw:text-[#b9afc3]">{note}</p>{/if}
  </div>
</article>

<style>
  .talk-gacha {
    color-scheme: dark;
    overflow-wrap: anywhere;
  }
  .talk-grid {
    background-image:
      linear-gradient(#b6a0d00c 1px, transparent 1px), linear-gradient(90deg, #b6a0d00c 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: linear-gradient(to left, #000, transparent 80%);
  }
  .talk-action::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(110deg, transparent 35%, #fff3 50%, transparent 65%);
    transform: translateX(-125%);
  }
  @media (prefers-reduced-motion: no-preference) {
    .talk-gacha:is(:hover, :focus-within) .talk-shimmer {
      animation: border-pass 1.2s ease-out both;
    }
    .talk-action:hover::after {
      animation: action-pass 600ms ease-out;
    }
  }
  @keyframes border-pass {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: translateX(400%);
      opacity: 0;
    }
  }
  @keyframes action-pass {
    to {
      transform: translateX(125%);
    }
  }
</style>
