insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('agency-references','agency-references',false,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;

CREATE POLICY agency_reference_upload ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='agency-references' AND (storage.foldername(name))[1]=auth.uid()::text AND lower(storage.extension(name)) IN ('jpg','jpeg','png','webp'));
CREATE POLICY agency_reference_read ON storage.objects FOR SELECT TO authenticated USING(bucket_id='agency-references' AND ((storage.foldername(name))[1]=auth.uid()::text OR public.has_role(auth.uid(),'admin')));
CREATE POLICY agency_reference_delete ON storage.objects FOR DELETE TO authenticated USING(bucket_id='agency-references' AND (storage.foldername(name))[1]=auth.uid()::text);

REVOKE SELECT ON public.video_jobs FROM authenticated;
GRANT SELECT(id,user_id,quote_id,ad_type,duration,sound,quoted_rwf,charged_rwf,status,output_path,created_at) ON public.video_jobs TO authenticated;
REVOKE ALL ON FUNCTION public.default_agency_settings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.default_agency_settings() TO service_role;
CREATE FUNCTION public.admin_agency_settings() RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$ BEGIN IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Administrator access required'; END IF; RETURN coalesce((SELECT config FROM public.agency_settings WHERE id=true),public.default_agency_settings()); END $$;
REVOKE ALL ON FUNCTION public.admin_agency_settings() FROM PUBLIC; GRANT EXECUTE ON FUNCTION public.admin_agency_settings() TO authenticated,service_role;

REVOKE EXECUTE ON FUNCTION public.calculate_video_quote(text,integer,boolean) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.default_agency_settings() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_agency_settings() FROM anon;
REVOKE EXECUTE ON FUNCTION public.reserve_video_quote(text,integer,boolean,jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid,public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.calculate_video_quote(text,integer,boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.default_agency_settings() TO service_role;