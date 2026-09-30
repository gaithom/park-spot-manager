import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
			},
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: [
					'Inter',
					'InterVariable',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif',
				],
				mono: [
					'ui-monospace',
					'SFMono-Regular',
					'SF Mono',
					'JetBrains Mono',
					'Roboto Mono',
					'Menlo',
					'Consolas',
					'monospace',
				],
			},
			fontSize: {
				'2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					sunken: 'hsl(var(--surface-sunken))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					subtle: 'hsl(var(--primary-subtle))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				brass: {
					DEFAULT: 'hsl(var(--brass))',
					foreground: 'hsl(var(--brass-foreground))',
					subtle: 'hsl(var(--brass-subtle))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
					subtle: 'hsl(var(--success-subtle))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
					subtle: 'hsl(var(--warning-subtle))'
				},
				danger: {
					DEFAULT: 'hsl(var(--danger))',
					foreground: 'hsl(var(--danger-foreground))',
					subtle: 'hsl(var(--danger-subtle))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))',
					subtle: 'hsl(var(--info-subtle))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar))',
					foreground: 'hsl(var(--sidebar-foreground))',
					muted: 'hsl(var(--sidebar-muted))',
					primary: 'hsl(var(--primary))',
					'primary-foreground': 'hsl(var(--primary-foreground))',
					accent: 'hsl(var(--sidebar-active))',
					'accent-foreground': 'hsl(var(--sidebar-foreground))',
					active: 'hsl(var(--sidebar-active))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--ring))'
				}
			},
			borderColor: {
				strong: 'hsl(var(--border-strong))',
			},
			borderRadius: {
				sm: 'calc(var(--radius) - 4px)',
				md: 'calc(var(--radius) - 2px)',
				lg: 'var(--radius)',
				xl: 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 10px)',
			},
			boxShadow: {
				xs: '0 1px 2px 0 hsl(var(--shadow-tint) / 0.05)',
				sm: '0 1px 2px -1px hsl(var(--shadow-tint) / 0.09), 0 1px 1px -1px hsl(var(--shadow-tint) / 0.05)',
				DEFAULT: '0 1px 3px 0 hsl(var(--shadow-tint) / 0.08), 0 1px 2px -1px hsl(var(--shadow-tint) / 0.06)',
				md: '0 4px 12px -3px hsl(var(--shadow-tint) / 0.09), 0 2px 4px -2px hsl(var(--shadow-tint) / 0.05)',
				lg: '0 12px 28px -8px hsl(var(--shadow-tint) / 0.14), 0 4px 10px -4px hsl(var(--shadow-tint) / 0.07)',
				xl: '0 24px 48px -14px hsl(var(--shadow-tint) / 0.2), 0 8px 16px -8px hsl(var(--shadow-tint) / 0.1)',
				'inner-hairline': 'inset 0 1px 0 0 hsl(0 0% 100% / 0.05)',
				none: 'none',
			},
			transitionTimingFunction: {
				'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-up': {
					from: { opacity: '0', transform: 'translateY(8px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.97)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				shimmer: {
					'100%': { transform: 'translateX(100%)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out both',
				'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
				'scale-in': 'scale-in 0.2s cubic-bezier(0.22, 1, 0.36, 1) both',
				shimmer: 'shimmer 1.8s infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
