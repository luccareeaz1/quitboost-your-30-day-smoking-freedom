import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'pt-BR',
    resources: {
      en: {
        translation: {
          common: {
            days: 'days',
            hours: 'h',
            minutes: 'm',
            seconds: 's',
            loading: 'LOADING YOUR JOURNEY...',
          },
          hero: {
            title: 'FRESH AIR. NEW LIFE.',
            subtitle: 'THE ULTIMATE TECHNOLOGY TO QUIT SMOKING',
            cta: 'Start Journey',
            socialProof: 'JOIN +87K USERS',
          },
          dashboard: {
            greeting: 'You are on the right path',
            motivation: 'Every second without smoking is a gift to yourself.',
            sos: 'SOS: EMERGENCY MODE',
            crave: 'Beat a Craving',
            relapse: 'Register Relapse',
          },
          sidebar: {
            overview: 'Overview',
            analysis: 'Analysis',
            badges: 'Badges',
            missions: 'Missions',
            coach: 'AI Coach',
            social: 'Social',
            profile: 'Profile',
            logout: 'Logout',
            commandCenter: 'Command Center'
          }
        }
      },
      'pt-BR': {
        translation: {
          common: {
            days: 'dias',
            hours: 'h',
            minutes: 'm',
            seconds: 's',
            loading: 'CARREGANDO SUA JORNADA...',
          },
          hero: {
            title: 'AR PURO. NOVA VIDA.',
            subtitle: 'A TECNOLOGIA DEFINITIVA PARA PARAR DE FUMAR',
            cta: 'Começar jornada',
            socialProof: 'JUNTE-SE A +87K USUÁRIOS',
          },
          dashboard: {
            greeting: 'Você está no caminho certo',
            motivation: 'Cada segundo sem fumar é um presente que você dá a si mesmo.',
            sos: 'SOS: MODO EMERGÊNCIA',
            crave: 'Venci uma Fissura',
            relapse: 'Registrar Recaída',
          },
          sidebar: {
            overview: 'Visão Geral',
            analysis: 'Análise',
            badges: 'Conquistas',
            missions: 'Missões',
            coach: 'Coach IA',
            social: 'Social',
            profile: 'Perfil',
            logout: 'Sair',
            commandCenter: 'Centro de Comando'
          }
        }
      }
    },
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
