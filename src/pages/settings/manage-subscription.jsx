import CreateSubscription from "../../components/dashboard/CreateSubscription";
import InteractiveButton from "../../components/InteractiveButton";
import EditSubscription from "../../components/dashboard/EditSubscription";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { fCurrency } from "../../utils/formatNumber";

export default function ManageSubscription() {
  const [isCreateSubscriptionModalOpen, setIsCreateSubscriptionModalOpen] =
    useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const { user } = useAuth();

  return (
    <>
      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold">Manage Subscription</h1>
        </div>
        {!user?.pricing?.length && (
          <div className="mb-5 space-y-3">
            <p className="text-sm font-medium mb-2">
              Create a new subscription
            </p>
            <p className="text-sm text-gray-500">
              Setup your subscription plans and add discounts for longer
              durations.
            </p>
            <InteractiveButton
              onClick={() => setIsCreateSubscriptionModalOpen(true)}
            >
              Create Subscription
            </InteractiveButton>
          </div>
        )}
      </div>

      {user?.pricing?.length > 0 && (
        <div>
          <div className="mb-5 space-y-3">
            <p className="text-sm font-medium mb-2">Subscription tiers</p>
            <p className="text-sm text-gray-500">
              These are your active subscription tiers
            </p>
          </div>
          <div className="space-y-4">
            {user?.pricing?.map((plan, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
              >
                <p className="text-sm">{plan.noOfMonths} month(s)</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <p className="text-xs font-medium">
                      {fCurrency(plan.amount)}
                    </p>
                    {plan.discountPercentage != 0 && (
                      <p className="text-xs text-gray-500">
                        ({plan.discountPercentage}% discount)
                      </p>
                    )}
                  </div>
                  <button
                    className="text-white text-xs bg-primary px-3 py-2 rounded-md"
                    onClick={() => setEditingPlan({ plan, index })}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCreateSubscriptionModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <CreateSubscription
            isOpen={isCreateSubscriptionModalOpen}
            onClose={() => setIsCreateSubscriptionModalOpen(false)}
          />
        </div>
      )}

      {editingPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <EditSubscription
            isOpen={!!editingPlan}
            onClose={() => setEditingPlan(null)}
            initialPlan={editingPlan.plan}
            planIndex={editingPlan.index}
          />
        </div>
      )}
    </>
  );
}
