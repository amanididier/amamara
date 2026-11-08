import { describe, expect, it } from 'vitest';
import { consultationSchema, contactAction, isSelfServiceDuration, creativeBrief } from './agency';
const v={customerName:'Keza',business:'Keza shop',objective:'Promote shoes',audience:'Kigali shoppers',message:'New shoes',scenes:'Show the product',style:'Natural',platforms:['Instagram'],deadline:'Next week',instructions:'',references:'',adType:'product' as const,duration:30 as const,contactMethod:'whatsapp' as const,contactDetail:'+250788123456'};
describe('Locked video durations',()=>{
  it('allows 10-second self-service',()=>expect(isSelfServiceDuration(10)).toBe(true));
  it('allows 15-second self-service',()=>expect(isSelfServiceDuration(15)).toBe(true));
  it('routes 30 seconds away from self-service',()=>expect(isSelfServiceDuration(30)).toBe(false));
  it('routes one minute away from self-service',()=>expect(isSelfServiceDuration(60)).toBe(false));
  it('does not allow the old 20-second option',()=>expect(isSelfServiceDuration(20)).toBe(false));
});
describe('Real consultation rules',()=>{
  it('validates the selected contact channel only',()=>expect(consultationSchema.safeParse(v).success).toBe(true));
  it('requires valid email when email is chosen',()=>expect(consultationSchema.safeParse({...v,contactMethod:'email'}).success).toBe(false));
  it('never opens an invented contact destination',()=>expect(contactAction('whatsapp',{phone:'',whatsapp:'',email:'',instagram:''},'AMA-1')).toBe(null));
  it('preserves the saved reference in WhatsApp handoff',()=>expect(contactAction('whatsapp',{phone:'',whatsapp:'+250788123456',email:'',instagram:''},'AMA-1')).toContain('AMA-1'));
  it('includes the customer duration in the structured brief',()=>expect(creativeBrief(v)).toContain('product / 30s'));
});