import type {MetadataRoute} from 'next';
import {site} from '@/data/site';
export const dynamic='force-static';
export default function robots():MetadataRoute.Robots{return {rules:site.production?{userAgent:'*',allow:'/',disallow:['/admin/','/qr/','/conceptos/','/entradas/']}:{userAgent:'*',disallow:'/'},sitemap:site.url+'/sitemap.xml'}}
