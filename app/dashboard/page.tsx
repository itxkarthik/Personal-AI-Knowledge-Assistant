"use client";

import {
	LinkCardGrid,
	OverviewHero,
	RecentDocumentsPanel,
	RecentNotesPanel,
} from "@/components/features/dashboard";
import {
	dashboardCards,
	dashboardQuickActions,
} from "@/components/features/dashboard/data";
import { useDashboardOverview } from "@/lib/hooks/useDashboardOverview";

export default function DashboardPage() {
	const { notes, documents, noteCount, documentCount, isLoading, errorMessage } =
		useDashboardOverview();

	return (
		<div className="space-y-6">
			<OverviewHero
				noteCount={noteCount}
				documentCount={documentCount}
				quickActionCount={dashboardQuickActions.length}
			/>

			<LinkCardGrid
				items={dashboardQuickActions}
				gridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
				titleClassName="text-base"
			/>

			<LinkCardGrid
				items={dashboardCards}
				gridClassName="grid gap-4 sm:grid-cols-2"
				titleClassName="text-lg"
			/>

			<section className="grid gap-4 lg:grid-cols-2">
				<RecentNotesPanel
					notes={notes}
					isLoading={isLoading}
					errorMessage={errorMessage}
				/>
				<RecentDocumentsPanel
					documents={documents}
					isLoading={isLoading}
					errorMessage={errorMessage}
				/>
			</section>
		</div>
	);
}
