import React from 'react';
import { ArrowUpRight, FolderKanban, Languages, LogOut, Package, Settings, Download, Youtube, ChevronRight } from 'lucide-react';

export type AdminTab = 'products' | 'categories' | 'videos' | 'settings' | 'backup' | 'languages';
const sections: {id: AdminTab; label: string; description: string; icon: typeof Package}[] = [
  {id:'products',label:'제품 관리',description:'상품 정보부터 대표 사진까지, 컬렉션을 관리하세요.',icon:Package},
  {id:'categories',label:'카테고리',description:'상품 분류와 콘텐츠가 표시되는 위치를 정리하세요.',icon:FolderKanban},
  {id:'videos',label:'영상 라이브러리',description:'로봇 주행 영상과 영상 카테고리를 관리하세요.',icon:Youtube},
  {id:'settings',label:'스토어 설정',description:'브랜드 이미지, 홈 화면 문구와 연락처를 설정하세요.',icon:Settings},
  {id:'languages',label:'언어 및 운영',description:'지원 언어와 스토어 운영 안내를 확인하세요.',icon:Languages},
  {id:'backup',label:'백업 및 복원',description:'스토어 데이터를 파일로 보관하고 복원하세요.',icon:Download},
];

const Brand = () => <><img src="/logo.svg" alt=""/><span>K.F.C.<small>ROBOTICS</small></span></>;

export function AdminAccessFrame({children,onExit}:{children:React.ReactNode;onExit:()=>void}) {
  return <div className="admin-access">
    <aside className="admin-access-brand">
      <button onClick={onExit} aria-label="스토어로 이동" className="admin-brand"><Brand/></button>
      <div className="admin-access-intro"><p>스토어 관리 공간</p><h2>당신의 스토어를,<br/>한곳에서.</h2><span>상품, 영상, 브랜드 설정을<br/>차분하게 관리하는 공간.</span></div>
      <div className="admin-access-signature"><span>K.F.C. ROBOTICS</span><span>관리자 전용</span></div>
    </aside>
    <main className="admin-access-content">{children}</main>
  </div>;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onExit: () => void;
  onLogout: () => void;
  productCount: number;
  videoCount: number;
  categoryCount: number;
  notice: string | null;
}

export function AdminLayout({children,activeTab,onTabChange,onExit,onLogout,productCount,videoCount,categoryCount,notice}:AdminLayoutProps) {
  const current=sections.find(section=>section.id===activeTab)!;
  return <div className="admin-studio">
    <aside className="admin-sidebar">
      <button className="admin-brand" onClick={onExit} aria-label="스토어로 이동"><Brand/></button>
      <p className="admin-nav-caption">스토어 관리</p>
      <nav className="admin-nav" aria-label="관리자 메뉴">
        {sections.map(({id,label,icon:Icon},index)=><button key={id} onClick={()=>onTabChange(id)} aria-current={activeTab===id?'page':undefined} data-admin-tab={id}>
          <Icon size={17}/><span>{label}</span><small>{String(index+1).padStart(2,'0')}</small>
        </button>)}
      </nav>
      <div className="admin-sidebar-bottom"><p>나만의 컬렉션.<br/>하나의 관리 공간.</p><button onClick={onExit}>스토어 보기<ArrowUpRight size={16}/></button></div>
    </aside>
    <div className="admin-workspace">
      <header className="admin-topbar"><div><span>관리자 센터</span><ChevronRight size={13}/><strong>{current.label}</strong></div><div><button className="admin-store-link" onClick={onExit}>스토어 보기<ArrowUpRight size={14}/></button><button id="admin-logout-btn" onClick={onLogout}><LogOut size={15}/><span>로그아웃</span></button></div></header>
      <main className="admin-main">
        <div className="admin-page-heading"><div><p>K.F.C. ROBOTICS / 관리 공간</p><h1>{current.label}</h1><span>{current.description}</span></div><span className="admin-workspace-label">스토어 관리</span></div>
        <div className="admin-overview" aria-label="등록 콘텐츠 현황">
          <div><Package size={17}/><span>등록 제품</span><strong>{productCount.toLocaleString()}</strong></div>
          <div><Youtube size={17}/><span>등록 영상</span><strong>{videoCount.toLocaleString()}</strong></div>
          <div><FolderKanban size={17}/><span>상품 카테고리</span><strong>{categoryCount.toLocaleString()}</strong></div>
        </div>
        <div className="admin-content" key={activeTab}>{children}</div>
      </main>
    </div>
    {notice&&<div role="status" className="admin-notice">{notice}</div>}
  </div>;
}
