'use client'

import { useSceneStore } from '@/store/useSceneStore'
import { useMoodStore } from '@/store/useMoodStore'
import { resetCamera } from '@/lib/gsapConfig'

const SECTION_CONTENT = {
  projects: {
    title: 'Projects',
    emoji: '🍵',
    items: [
      {
        name: 'Lydia Studio',
        description: 'A calm focus tool for ADHD minds. Ambient sounds, gentle timers, AI task decomposition.',
        tags: ['Next.js', 'Supabase', 'OpenAI'],
        link: '#',
      },
      {
        name: 'This Portfolio',
        description: 'An adaptive 3D tea shop where a sloth guides you based on your mood.',
        tags: ['React Three Fiber', 'GSAP', 'OpenAI'],
        link: '#',
      },
      {
        name: 'Gentle Planner',
        description: 'A minimal daily planner that meets you where you are emotionally.',
        tags: ['React', 'Tone.js', 'Framer Motion'],
        link: '#',
      },
    ],
  },
  'case-studies': {
    title: 'Case Studies',
    emoji: '📓',
    items: [
      {
        name: 'Redesigning Focus for ADHD Minds',
        description: 'Research into how traditional productivity tools fail neurodivergent users.',
        tags: ['UX Research', 'Accessibility', 'ADHD'],
        link: '#',
      },
      {
        name: 'AI as Co-Designer',
        description: 'Exploring how LLMs can participate in UX decisions as collaborators.',
        tags: ['AI/UX', 'LLMs', 'Design Systems'],
        link: '#',
      },
      {
        name: 'The Ethics of Gentle Tech',
        description: 'Applying calm technology principles (Mark Weiser) to modern AI products.',
        tags: ['Ethics', 'Calm Tech', 'AI'],
        link: '#',
      },
    ],
  },
  about: {
    title: 'About Lydia',
    emoji: '🪟',
    items: [
      {
        name: 'UX Engineer + AI Designer',
        description: 'I build interfaces people feel. I care about emotion, experience, and the space between.',
        tags: ['UX Engineering', 'AI Integration', 'Storytelling'],
        link: '#',
      },
      {
        name: 'Philosophy',
        description: 'Good design feels like breathing — you don\'t notice it\'s working until you stop and realize you felt at ease the whole time.',
        tags: ['Calm Technology', 'Neurodivergent Design'],
        link: '#',
      },
    ],
  },
  contact: {
    title: 'Say Hello',
    emoji: '🎧',
    items: [
      {
        name: 'Open to Opportunities',
        description: 'UX Engineer, AI Product Designer, creative collaborations, coffee chats.',
        tags: ['Full-time', 'Freelance', 'Collabs'],
        link: 'mailto:lydia@example.com',
      },
      {
        name: 'Find Me Online',
        description: 'GitHub · LinkedIn · Twitter/X',
        tags: ['@lydiacodesdaily'],
        link: 'https://github.com/lydiacodesdaily',
      },
    ],
  },
}

export function ContentPanel() {
  const { isContentPanelOpen, contentPanelSection, closeContentPanel } = useSceneStore()
  const moodConfig = useMoodStore((s) => s.moodConfig)

  const handleClose = async () => {
    const durationMult = moodConfig?.cameraAnimation.durationMultiplier ?? 1
    closeContentPanel()
    await resetCamera(durationMult)
  }

  const content = contentPanelSection ? SECTION_CONTENT[contentPanelSection] : null

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ease-out
        ${isContentPanelOpen ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      <div className="mx-auto max-w-2xl">
        <div className="bg-black/70 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6 shadow-2xl">
          {content && (
            <>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{content.emoji}</span>
                  <h2 className="text-white text-lg font-medium">{content.title}</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white/40 hover:text-white/80 transition-colors text-sm"
                >
                  esc
                </button>
              </div>

              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                {content.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.link}
                    className="group block bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-xl p-4 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-white text-sm font-medium group-hover:text-matcha-300 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-white/20 group-hover:text-white/50 text-xs mt-0.5 flex-shrink-0">
                        →
                      </span>
                    </div>
                    <p className="text-white/50 text-xs mt-1 leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-matcha-400/70 text-xs border border-matcha-400/20 rounded-full px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
