REVOKE EXECUTE ON FUNCTION public.calculate_video_quote(text,integer,boolean) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.default_agency_settings() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_agency_settings() FROM anon;
REVOKE EXECUTE ON FUNCTION public.reserve_video_quote(text,integer,boolean,jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid,public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.calculate_video_quote(text,integer,boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.default_agency_settings() TO service_role;