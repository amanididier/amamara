<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the seven-question creation brief in a client-safe validation module and persist drafts locally; production output must never be fabricated.
- Use the existing authoritative MTN payment service for wallet operations; retain idempotency keys when retrying the same intended payment.
- Public gallery comments use the existing RLS-protected comments table rather than browser-only storage, so they survive reloads across visitors.
- Video prices are authoritative database RPCs with immutable quote snapshots; never feed video orders into the legacy placeholder MTN pricing service until billing is reconciled.
- Agency consultations use validated client-safe briefs, authenticated server submission, RLS-isolated leads and private user-scoped reference storage; admin roles are protected separately from user metadata.
- The agency video route renders real persisted jobs only; provider generation remains disabled until the locked models, documented endpoints and authoritative payment lifecycle are connected.
