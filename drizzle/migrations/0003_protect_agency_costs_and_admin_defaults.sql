REVOKE SELECT ON public.video_jobs FROM authenticated;
GRANT SELECT(id,user_id,quote_id,ad_type,duration,sound,quoted_rwf,charged_rwf,status,output_path,created_at) ON public.video_jobs TO authenticated;
REVOKE ALL ON FUNCTION public.default_agency_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.default_agency_settings() TO service_role;
CREATE FUNCTION public.admin_agency_settings() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$ BEGIN IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Administrator access required'; END IF; RETURN coalesce((SELECT config FROM public.agency_settings WHERE id=true),public.default_agency_settings()); END $$;
REVOKE ALL ON FUNCTION public.admin_agency_settings() FROM PUBLIC; GRANT EXECUTE ON FUNCTION public.admin_agency_settings() TO authenticated,service_role;