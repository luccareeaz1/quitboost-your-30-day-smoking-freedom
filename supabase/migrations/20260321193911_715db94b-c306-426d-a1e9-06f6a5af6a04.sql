
-- Fix security definer view by using security_invoker
DROP VIEW IF EXISTS public.leaderboard;
CREATE VIEW public.leaderboard WITH (security_invoker = true) AS
SELECT
  p.id AS user_id,
  p.display_name,
  p.avatar_url,
  p.total_points AS points,
  s.current_streak AS streak,
  s.total_days_smoke_free AS days_smoke_free,
  ROW_NUMBER() OVER (ORDER BY p.total_points DESC NULLS LAST) AS rank
FROM public.profiles p
LEFT JOIN public.streaks s ON s.user_id = p.id
WHERE p.privacy = 'public';
